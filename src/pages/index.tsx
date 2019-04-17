import React from 'react';
import { Gitmoji, GitmojiData } from '@/types';
import { Card, Col, Row } from 'antd';
import randomColor from 'randomcolor';
declare const window: any;

const EXPEND_HEIGHT = 560;
const initState = () => {
  return {
    gitmojis: [] as Gitmoji[],
    displayGitmojis: [] as Gitmoji[],
  };
};

const fetchGitmojiData = async (): Promise<GitmojiData|void> => {
  const url = `https://raw.githubusercontent.com/carloscuesta/gitmoji/master/src/data/gitmojis.json`;
  const response = await fetch(url, {
    method: 'GET',
  });
  if (response.ok) {
    return await response.json() as GitmojiData;
  }
};

export default class Index extends React.Component<any, ReturnType<typeof initState>> {
  constructor(props) {
    super(props);
    this.state = initState();
  }
  async componentDidMount() {
    const gitmojiData = await fetchGitmojiData() || window.helper.defaultData;
    this.setState({ gitmojis: gitmojiData.gitmojis, displayGitmojis: gitmojiData.gitmojis });
    utools.setExpendHeight(EXPEND_HEIGHT);
    utools.setSubInput(this.handleSearch, '输入关键词搜索，点击 emoji 复制');
  }
  handleCopyCode = (code) => {
    window.helper.electron.clipboard.writeText(code);
    utools.setSubInputValue('');
    utools.hideMainWindow();
  };
  handleSearch = ({ text: descOrName }) => {
    if (!descOrName) {
      this.setState({ displayGitmojis: [...this.state.gitmojis] });
      return;
    }
    this.setState({
      displayGitmojis: this.state.gitmojis.filter(e => {
        return e.code === descOrName
          || e.name.indexOf(descOrName) > -1
          || e.name.toLowerCase().indexOf(descOrName.toLowerCase()) > -1
          || e.description.indexOf(descOrName) > -1
          || e.description.toLowerCase().indexOf(descOrName.toLowerCase()) > -1;
      }),
    });
  };
  handleTranslate = (english) => {
    utools.redirect('translate', english);
    utools.showMainWindow();
  };
  render() {
    return (
      <Row type={'flex'} gutter={12} justify={'center'}>
        {
          this.state.displayGitmojis.map(e => {
            return (
              <Col span={6} key={e.name} style={{ marginTop: '10px' }}>
                <Card
                  hoverable
                  style={{ height: 260 }}
                  cover={(
                    <div
                      style={{ fontSize: '5em', textAlign: 'center' }}
                      onClick={() => this.handleCopyCode(e.code)}
                    >
                      {e.emoji}
                    </div>
                  )}
                >
                  <Card.Meta
                    title={e.code}
                    description={(
                      <a onClick={() => this.handleTranslate(e.description)}>
                        {e.description}
                      </a>
                    )}
                  />
                </Card>
              </Col>
            );
          })
        }
      </Row>
    );
  }
}
