import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { WebsiteContentService } from '../../../services/websitecontent.service';
import { IContent } from '../../../models/websitecontent';


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

  constructor(private websitecontentService: WebsiteContentService) { }

  ngOnInit(): void {
    this.websitecontentService.getAllContents().subscribe(data => {
      console.log('Danh sách content:', data);
      this.websiteContents = data;
    });
  }

  onEdit(content: any) {

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

}


