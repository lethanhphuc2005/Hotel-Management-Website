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

}


