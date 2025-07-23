import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment'; // Đảm bảo đường dẫn đúng

@Injectable({
  providedIn: 'root',
})
export class ImageHelperService {
  private readonly imgUrl = environment.imgUrl;

  getImageUrl(image: string | File): string {
    if (typeof image === 'string') {
      return `${this.imgUrl}/${image}`;
    } else if (image instanceof File) {
      return URL.createObjectURL(image);
    }
    return '';
  }
}
