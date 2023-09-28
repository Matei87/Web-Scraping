import { useState } from 'react';
import { Button, Form, Input, Select, Spin } from 'antd';

const App = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);
  const [error, setError] = useState('');
  const [isError, setIsError] = useState(false);

  const onFinish = async (values) => {
    setIsLoading(true);
    try {
      console.log('Success:', values);

      const request = await fetch('http://localhost:8000/api', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });
      console.log('request ', request, JSON.stringify(values));
      if (request.statusText !== 'OK') {
        setIsError(true);
        setError(request.statusText);
      }
      const response = await request.json();
      if (request.status === 200) {
        setIsError(false);
        setData(response);
      }

      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };
  console.log(isLoading, data, error);
  return (
    <div className='wrapper'>
      <h2>Web Scraping API</h2>
      <Form
        style={{
          width: 1280,
          justifyContent: 'center',
        }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete='off'
        size='large'
        layout='inline'
      >
        <Form.Item
          name='tag'
          rules={[
            {
              required: true,
              message: 'Please select a tag!',
            },
          ]}
        >
          <Select
            placeholder='Select a tag'
            style={{ width: 350, height: 50 }}
            options={[
              { value: 'h3', label: 'h3' },
              { value: 'p', label: 'Paragraph' },
              { value: 'img', label: 'Image' },
              { value: 'a', label: 'Link' },
            ]}
          />
        </Form.Item>

        <Form.Item
          name='url'
          rules={[
            {
              required: true,
              message: 'Please enter a URL!',
            },
            {
              type: 'url',
              message: 'This field must be a valid url.',
            },
          ]}
        >
          <Input
            style={{ width: 550 }}
            addonBefore='https://'
            placeholder='Enter a URL'
          />
        </Form.Item>

        <Form.Item>
          <Button style={{ width: 100, height: 50 }} htmlType='submit'>
            Submit
          </Button>
        </Form.Item>
      </Form>

      <h3>Data</h3>
      <div>
        {isLoading && (
          <Spin tip='Loading' size='large'>
            <div className='content' />
          </Spin>
        )}

        {!isError && !isLoading && data.length > 0 && (
          <div
            style={{
              height: 900,
              width: 1200,
              overflow: 'hidden',
              overflowY: 'scroll',
            }}
          >
            {data.map((el, idx) => (
              <pre key={el + idx} style={{ textAlign: 'left' }}>
                {JSON.stringify(el, null, 2)}
              </pre>
            ))}
          </div>
        )}
        {!error && !isLoading && data.length === 0 && <p>No Data !</p>}
        {!isLoading && isError && error && (
          <p style={{ color: 'red', fontSize: '1.55rem' }}>{error}!</p>
        )}
      </div>
    </div>
  );
};

export default App;
