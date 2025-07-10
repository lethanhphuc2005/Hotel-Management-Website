import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { WebsiteContentService } from '../../core/services/websitecontent.service';
import { IContent } from '../../types/website-content';
import { ContentTypeService } from '../../core/services/content-type.service';
import { ContentType } from '../../types/content-type';


@Component({
  selector: 'app-websitecontent',
  standalone: true,
  templateUrl: './websitecontent.component.html',
  styleUrls: ['./websitecontent.component.scss'],
  imports: [RouterModule, CommonModule, HttpClientModule, FormsModule],
})
export class WebsitecontentComponent implements OnInit {
  websiteContents: IContent[] = [];
  contents: any;
  img: any;
  rt: any;
  contentTypes: ContentType[] = [];
  searchKeyword: string = '';
  filteredReviews: any;
  reviews: any;
  filteredContents: any;


  constructor(private websitecontentService: WebsiteContentService, private contentTypeService: ContentTypeService) { }
  ngOnInit(): void {
    this.websitecontentService.getAllContents().subscribe(data => {
      this.websiteContents = data;
      this.filteredContents = data; // hiển thị ban đầu
      console.log('Danh sách content:', data);
    });

    this.contentTypeService.getAll().subscribe(response => {
      this.contentTypes = response.data;
      console.log('Danh sách loại content:', response.data);
    });
  }


  getAllContents() {
    this.websitecontentService.getAllContents().subscribe(data => {
      this.websiteContents = data;
      this.filteredContents = data;
    });
  }


  onDelete(content: IContent) {
    const confirmed = window.confirm(`Bạn có chắc muốn xoá bài viết "${content.title}" không?`);
    if (!confirmed) return;

    this.websitecontentService.onDelete(content._id).subscribe({
      next: () => {
        // Xóa thành công, cập nhật lại danh sách local
        this.websiteContents = this.websiteContents.filter(c => c._id !== content._id);
        alert('Xóa bài viết thành công!');
      },
      error: (err) => {
        console.error('Lỗi khi xóa bài viết', err);
        alert('Xóa bài viết thất bại. Vui lòng thử lại.');
      }
    });
  }

getContentTypeName(typeId: string): string {
  if (!Array.isArray(this.contentTypes)) return 'Không rõ';
  const type = this.contentTypes.find(t => t._id === typeId);
  return type ? type.name : 'Không rõ';
}



  // popup xem
  isDetailPopupOpen: boolean = false;
  selectedContent!: IContent;

  onViewDetail(content: IContent) {
    this.selectedContent = content;
    this.isDetailPopupOpen = true;
  }
  // tìm kiếm

  onSearch() {
    const keyword = this.searchKeyword.trim().toLowerCase();
    this.filteredContents = this.websiteContents.filter((content: IContent) =>
      (content.title || '').toLowerCase().includes(keyword)
    );
  }
  // thêm
  isAddPopupOpen = false;
  newContent: any = {
    title: '',
    content_type_id: '',
    content: '',
    image: null
  };

  onAdd() {
    this.newContent = {
      title: '',
      content_type_id: '',
      content: '',
      image: null
    };
    this.isAddPopupOpen = true;
    this.getAllContentTypes(); // load danh sách loại nội dung
  }

  closeAddPopup() {
    this.isAddPopupOpen = false;
  }

  onAddSubmit() {
    const formData = new FormData();
    formData.append('title', this.newContent.title);
    formData.append('content_type_id', this.newContent.content_type_id);
    formData.append('content', this.newContent.content || '');
    if (this.newContent.image) {
      formData.append('image', this.newContent.image);
    }

    this.websitecontentService.createContent(formData).subscribe({
      next: () => {
        this.isAddPopupOpen = false;
        this.getAllContents(); // reload lại danh sách
      },
      error: (err: any) => console.error(err)
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.newContent.image = file;
    }
  }

getAllContentTypes() {
  this.contentTypeService.getAll().subscribe({
    next: (res: any) => {
      this.contentTypes = Array.isArray(res.data) ? res.data : [];
    },
    error: err => console.error(err)
  });
}

  // sửa
  isEditPopupOpen = false;
  editContent: any = null;

onEdit(content: any) {
  console.log('Sửa content:', content);

  this.editContent = {
    _id: content._id,
    title: content.title || '',
    content_type_id: content.content_type_id || '',
    content: content.content || '',
    image: content.image || '',
    newImage: null
  };

  this.isEditPopupOpen = true;
  this.getAllContentTypes();
}



  onEditFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.editContent.newImage = file;
    }
  }

  onEditSubmit() {
    const formData = new FormData();
    formData.append('title', this.editContent.title);
    formData.append('content_type_id', this.editContent.content_type_id);
    formData.append('content', this.editContent.content || '');
    if (this.editContent.newImage) {
      formData.append('image', this.editContent.newImage);
    }

    this.websitecontentService.updateContent(this.editContent._id, formData).subscribe({
      next: () => {
        this.isEditPopupOpen = false;
        this.getAllContents(); // refresh list
      },
      error: (err: any) => console.error(err)
    });
  }
}


