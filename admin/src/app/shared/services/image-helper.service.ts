import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment'; // Đảm bảo đường dẫn đúng

@Injectable({
  providedIn: 'root',
})
export class ImageHelperService {
  private readonly imgUrl = environment.imgUrl;

  getImageUrl(image?: string): string {
    return `${this.imgUrl}/${image}`;
  }
}
