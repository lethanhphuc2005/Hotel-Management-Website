import { Component, OnInit } from '@angular/core';
import { ContentTypeService } from '../../../services/content-type.service';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-content-type',
  standalone: true,
  templateUrl: './content-type.component.html',
  styleUrls: ['./content-type.component.scss'],
  imports: [RouterModule, CommonModule, HttpClientModule, FormsModule],
})
export class ContentTypeComponent implements OnInit {
  searchKeyword = '';
  contentTypeList: any[] = [];
  filteredContentTypes: any[] = [];

  isAddPopupOpen = false;
  isEditPopupOpen = false;
  isDetailPopupOpen = false;

  newContentType: any = {};
  editContentType: any = {};
  selectedContentType: any = {};

  constructor(private contentTypeService: ContentTypeService) { }

  ngOnInit() {
    this.getAll();
  }

  getAll() {
    this.contentTypeService.getAll().subscribe((res: any) => {
      this.contentTypeList = res.data.map((type: any) => ({
        ...type,
        websitecontents: type.websitecontents || []
      }));
      this.filteredContentTypes = res.data.map((type: { website_content_list: any; }) => ({
        ...type,
        website_content_list: type.website_content_list || []
      }));
    });
  }

  onSearch() {
    const keyword = this.searchKeyword.toLowerCase();
    this.filteredContentTypes = this.contentTypeList.filter((type) =>
      type.name.toLowerCase().includes(keyword)
    );
  }

  onAdd() {
    this.newContentType = {};
    this.isAddPopupOpen = true;
  }

  closeAddPopup() {
    this.isAddPopupOpen = false;
  }

  onAddSubmit() {
    this.contentTypeService.create(this.newContentType).subscribe(() => {
      this.closeAddPopup();
      this.getAll();
    });
  }

  onEdit(type: any) {
    this.editContentType = { ...type };
    this.isEditPopupOpen = true;
  }

  onEditSubmit() {
    this.contentTypeService.update(this.editContentType._id, this.editContentType).subscribe(() => {
      this.isEditPopupOpen = false;
      this.getAll();
    });
  }

  onDelete(type: any) {
    if (confirm('Bạn có chắc chắn muốn xóa?')) {
      this.contentTypeService.delete(type._id).subscribe(() => this.getAll());
    }
  }

  onViewDetail(type: any) {
    this.selectedContentType = type;
    this.isDetailPopupOpen = true;
  }
}

