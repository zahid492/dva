import Reac, { Component } from 'react';
import { Modal, Form, Input } from 'antd';

const FormItem = Form.Item;

class UserEditModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
  }

  showModelHandler = (e) => {
    if (e) e.stopPropagation();
    this.setState({
      visible: true,
    });
  };

  hideModelHandler = () => {
    this.setState({
      visible: false,
    });
  };

  okHandler = ()=> {
    const { onOk } = this.props;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        onOk(values);
        this.hideModelHandler();
      }
    });
  }

  render() {
    const { children, record: { name, email, website } } = this.props;
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };

    return (
      <div>
        <span onClick={this.showModelHandler}>{children}</span>
        <Modal
          title="edit user"
          visible={this.state.visible}
          onOk={this.okHandler}
          onCancel={this.hideModelHandler}
        >
          <Form layout="horizontal" onSubmit={this.okHandler}>

            <FormItem {...formItemLayout} label="Name">
              {getFieldDecorator('name', {
                initialValue: name,
              })(<Input/>)}
            </FormItem>
            <FormItem {...formItemLayout} label="Email">
              {getFieldDecorator('email', {
                initialValue: email,
              })(<Input/>)}
            </FormItem>
            <FormItem {...formItemLayout} label="WebSite">
              {getFieldDecorator('website', {
                initialValue: website,
              })(<Input/>)}
            </FormItem>

          </Form>
        </Modal>
      </div>
    );
  }


}


export default Form.create()(UserEditModal);
