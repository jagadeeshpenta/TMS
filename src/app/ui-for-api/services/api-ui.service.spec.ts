import { TestBed, inject } from '@angular/core/testing';

import { ApiUiService } from './api-ui.service';

describe('ApiUiService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ApiUiService]
    });
  });

  it('should ...', inject([ApiUiService], (service: ApiUiService) => {
    expect(service).toBeTruthy();
  }));
});
