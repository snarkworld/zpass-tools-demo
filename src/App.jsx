import { Layout as AntLayout, ConfigProvider, theme } from 'antd';
import IssuerApp from './pages/IssuerApp';
import { Outlet } from 'react-router-dom';

// Constants for repeated styles
const commonContentStyle = {
  textAlign: 'center',
};

const App = () => {
  const { Header, Content, Footer, Sider } = AntLayout;

  return (
    <ConfigProvider
      theme={{
        algorithm: theme.defaultAlgorithm,
        token: {
          colorPrimary: '#18e48f',
        },
      }}
    >
      <AntLayout>
        <Header>
          <img
            src="zpass.png"
            alt="zPass"
            style={{
              height: '34px',
              width: 'auto',
              float: 'left',
              marginLeft: '-34px',
              marginTop: '12px',
            }}
          />
        </Header>

        <Content style={{ margin: '0 10px 0 0' }}>
          <AntLayout hasSider>
            <Sider
              width={'30vw'}
              style={{ ...commonContentStyle, display: 'flex' }}
            >
              <IssuerApp />
            </Sider>
            <Content style={{ ...commonContentStyle }}>
              <Outlet />
            </Content>
          </AntLayout>
        </Content>

        <Footer style={{ textAlign: 'center' }}>
          zPass © 2023 Aleo Systems, Inc.
        </Footer>
      </AntLayout>
    </ConfigProvider>
  );
};

export default App;
