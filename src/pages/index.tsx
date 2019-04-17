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
    utools.setSubInput(this.handleSearch);
  }
  handleCopyCode = (code) => {
    window.helper.electron.clipboard.writeText(code);
    utools.showNotification('复制完成', '', true);
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
          || e.name.replace(/\-/g, '').toLowerCase().indexOf(descOrName.toLowerCase()) > -1
          || e.description.indexOf(descOrName) > -1
          || e.description.replace(/\s/g, '').toLowerCase().indexOf(descOrName.toLowerCase()) > -1;
      }),
    });
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
                  cover={(
                    <div
                      style={{ fontSize: '5em', textAlign: 'center', backgroundColor: randomColor() }}
                    >
                      {e.emoji}
                    </div>
                  )}
                  style={{ height: 260 }}
                  onClick={() => this.handleCopyCode(e.code)}
                >
                  <Card.Meta
                    title={e.code}
                    description={e.description}
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
