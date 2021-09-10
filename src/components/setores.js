import { useState, useEffect } from 'react';
import { Layout, Menu, Breadcrumb, Col, Row } from 'antd';
import { ApartmentOutlined } from '@ant-design/icons';
import { RegForm } from './adicionar'
import { RegForm as EditForm } from './editar'
import axios from 'axios';

const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;
export const Setores = () => {
    const [setores, setSetores] = useState([]);
    const [edit, setEdit] = useState(null);

    const updateData = () => {
        axios.get('http://localhost:3001/setores').then(({ data }) => {
            setSetores(data);
        })
    }

    useEffect(() => {
        updateData()
    }, [])

    function saveSetor(nome, cargos) {
        nome = nome.trim();
        cargos = [...cargos]

        if (cargos.length === 0) {
            alert('É necessário cadastrar ao menos um cargo.');
            return;
        }

        for (let i = 0; i < setores.length; i++) {
            if (i === edit) {
                continue;
            }

            const setor = setores[i];
            if (setor.nome === nome) {
                alert('Não é possível cadastrar mais de um setor com o mesmo nome.');
                return;
            }

            if (cargos.some(cargo => setor.cargos.includes(cargo))) {
                alert('Não é possível cadastrar mais de um cargo com o mesmo nome.');
                return;
            }
        }

        axios.put('http://localhost:3001/setores/' + setores[edit].id, {
            nome,
            cargos
        }).then(updateData)

        setEdit(null);
    }

    function addSetor(nome, cargos) {
        nome = nome.trim();
        cargos = [...cargos]

        if (cargos.length === 0) {
            alert('É necessário cadastrar ao menos um cargo.');
            return;
        }

        if (setores.some(setor => setor.nome === nome)) {
            alert('Não é possível cadastrar mais de um setor com o mesmo nome.');
            return;
        }

        if (setores.some(setor => cargos.some(cargo => setor.cargos.includes(cargo)))) {
            alert('Não é possível cadastrar mais de um cargo com o mesmo nome.');
            return;
        }

        axios.post('http://localhost:3001/setores', {
            id: `${Date.now()}${Math.random()}`,
            nome,
            cargos
        }).then(updateData)
    }

    function deleteSetor() {
        if (window.confirm('Deseja mesmo deletar o setor?')) {
            axios.delete('http://localhost:3001/setores/' + setores[edit].id).then(
                updateData
            )
            setEdit(null);
        }
    }

    return (
        <Layout>
            <Header className="header">
                <div className="logo" />
                <Menu theme="dark" mode="horizontal">
                </Menu>
            </Header>
            <Content style={{ padding: '0 50px' }}>
                <Breadcrumb style={{ margin: '16px 0' }}>
                    <Breadcrumb.Item>Início</Breadcrumb.Item>
                    <Breadcrumb.Item>Lista</Breadcrumb.Item>
                    <Breadcrumb.Item>Setores</Breadcrumb.Item>
                </Breadcrumb>
                <Layout className="site-layout-background" style={{ padding: '24px 0' }}>
                    <Sider className="site-layout-background" width={200}>
                        <Menu
                            mode="inline"
                            defaultSelectedKeys={['1']}
                            defaultOpenKeys={['sub1']}
                            style={{ height: '100%' }}
                        >
                            <Menu.Item key="home" onClick={() => setEdit(null)}>
                                Cadastrar
                            </Menu.Item>
                            {setores.map((setor, i) => (
                                <SubMenu key={setor.nome} onTitleClick={() => setEdit(i)} icon={<ApartmentOutlined />} title={setor.nome}>
                                    {setor.cargos.map(cargo => (
                                        <Menu.Item key={cargo}>
                                            {cargo}
                                        </Menu.Item>
                                    ))}
                                </SubMenu>
                            ))}
                        </Menu>
                    </Sider>
                    <Content style={{ padding: '0 24px', minHeight: 280 }}>
                        <div className="container">
                            <Row gutter={[20, 20]}>
                                <Col xs={{ span: 24 }} lg={{ span: 6 }}>
                                </Col>
                                <Col xs={{ span: 24 }} lg={{ span: 13 }}>
                                    <div className="box" >
                                        {
                                            edit != null
                                                ? <EditForm deleteSetor={deleteSetor} saveSetor={saveSetor} setor={setores[edit]} />
                                                : <RegForm addSetor={addSetor} />
                                        }
                                    </div>
                                </Col>
                            </Row>
                        </div>
                    </Content>
                </Layout>
            </Content>
        </Layout>
    );
}
