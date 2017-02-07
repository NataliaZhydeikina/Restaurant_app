import { SomethingPage } from './app.po';

describe('something App', function() {
  let page: SomethingPage;

  beforeEach(() => {
    page = new SomethingPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
