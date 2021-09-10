import React, { useState } from 'react';
import { Form, Button, Input, Col, Row } from 'antd';
import '../styles/add.css';
import axios from 'axios';


export const RegForm = ({ addSetor }) => {
  const [form] = Form.useForm();
  const [formLayout, setFormLayout] = useState('horizontal');
  const onFormLayoutChange = ({ layout }) => { setFormLayout(layout) };

  const initialValue = {
    nome: '',
    cargo: '',
  }

  const [values, setValues] = useState(initialValue);

  const [cargos, setCargos] = useState(new Set());

  function onChange(ev) {
    const { name, value } = ev.target;
    console.log(ev.target)
    setValues({ ...values, [name]: value })
    console.log({ name, value })
  }

  function onSubmit(ev) {
    ev.preventDefault();

    axios.post('url', values);
  }

  function add() {
    if (values.nome.trim().length === 0) {
      alert('Você não pode cadastrar um setor sem nome.');
      return;
    }
    addSetor(values.nome.trim(), cargos);
  }

  function addCargo() {
    if (values.cargo.trim().length === 0) {
      alert('Você não pode cadastrar um cargo sem nome.');
      return;
    }
    cargos.add(values.cargo.trim());
    setCargos(new Set(cargos));
  }

  const formItemLayout =
    formLayout === 'horizontal'
      ? {
        labelCol: {
          span: 4,
        },
        wrapperCol: {
          span: 14,
        },
      }
      : null;
  // const buttonItemLayout =
  //   formLayout === 'horizontal'
  //     ? {
  //       wrapperCol: {
  //         span: 14,
  //         offset: 4,
  //       },
  //     }
  //  : null;
  return (
    <>
      <h1 className="title">Adicionar Setor</h1>
      <Form
        {...formItemLayout}
        layout={formLayout}
        form={form}
        initialValues={{
          layout: formLayout,
        }}
        onValuesChange={onFormLayoutChange}
      >
        <Form.Item
          onSubmit={onSubmit}
          id="form"
          label="Nome"
          onChange={onChange}>
          <Input name="nome" placeholder="Nome" />
        </Form.Item>
        <Form.Item
          id="form"
          label="Cargo(s)"
          onChange={onChange}>
          <Row gutter={13}>
            <Col span={19}>
              <Input name="cargo" placeholder="Cargo" />
              <div className="cargo-itens">
                {[...cargos].map(cargo =>
                  <div key={cargo} className="cargo-item">
                    <span className="name">{cargo}</span>
                    <span className="close" onClick={() => { cargos.delete(cargo); setCargos(new Set(cargos)) }}>
                      X
                    </span>
                  </div>
                )}
              </div>
            </Col>
            <Col span={5}>
              <div>
                <Button onClick={addCargo} className="primary-button">
                  Adicionar
                </Button>
                <Button onClick={add} className="add-button" >
                  Salvar
                </Button>
              </div>
            </Col>
          </Row>
        </Form.Item>
      </Form>
    </>
  );
};
