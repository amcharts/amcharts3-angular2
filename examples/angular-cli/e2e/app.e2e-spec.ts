import { AngularCliPage } from './app.po';

describe('angular-cli App', () => {
  let page: AngularCliPage;

  beforeEach(() => {
    page = new AngularCliPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
