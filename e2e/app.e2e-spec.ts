import { TicTacToePage } from './app.po';

describe('tic-tac-toe App', () => {
  let page: TicTacToePage;

  beforeEach(() => {
    page = new TicTacToePage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
