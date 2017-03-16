import { TMSEVPage } from './app.po';

describe('tmsev App', () => {
  let page: TMSEVPage;

  beforeEach(() => {
    page = new TMSEVPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
