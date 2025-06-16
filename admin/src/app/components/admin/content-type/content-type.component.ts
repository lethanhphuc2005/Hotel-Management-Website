// pages/content-type/content-type.component.ts
import { Component, OnInit } from '@angular/core';
import { ContentType } from '../../../models/content-type';
import { ContentTypeService } from '../../../services/content-type.service';


@Component({
  selector: 'app-content-type',
  standalone: true,
  templateUrl: './content-type.component.html',
  styleUrls: ['./content-type.component.scss']
})
export class ContentTypeComponent implements OnInit {
  contentTypes: ContentType[] = [];

  constructor(private contentTypeService: ContentTypeService) {}

  ngOnInit(): void {
    this.getContentTypes();
  }

  getContentTypes() {
    this.contentTypeService.getAll().subscribe(data => {
      this.contentTypes = data.data;

    });
  }

  onDelete(id: string) {
    if (confirm('Bạn có chắc chắn muốn xoá?')) {
      this.contentTypeService.delete(id).subscribe(() => {
        this.getContentTypes();
      });
    }
  }

}
