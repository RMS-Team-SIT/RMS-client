<script setup>
import { ref } from 'vue';
import { Layout, Menu, Breadcrumb } from 'ant-design-vue';

const selectedKeys1 = ref(['2']);
const selectedKeys2 = ref(['1']);
const openKeys = ref(['sub1']);
</script>

<template>
  <Layout>
    <Layout.Header>
      <div class="logo">Your Logo</div>
      <Menu
        v-model:selectedKeys="selectedKeys1"
        theme="dark"
        mode="horizontal"
        :style="{ lineHeight: '64px' }"
      >
        <Menu.Item key="1">nav 1</Menu.Item>
        <Menu.Item key="2">nav 2</Menu.Item>
        <Menu.Item key="3">nav 3</Menu.Item>
      </Menu>
    </Layout.Header>
    <Layout.Content style="padding: 0 50px">
      <Breadcrumb style="margin: 16px 0">
        <Breadcrumb.Item>Home</Breadcrumb.Item>
        <Breadcrumb.Item>List</Breadcrumb.Item>
        <Breadcrumb.Item>App</Breadcrumb.Item>
      </Breadcrumb>
      <Layout style="padding: 24px 0; background: #fff">
        <Layout.Sider width="200" style="background: #fff">
          <Menu
            v-model:selectedKeys="selectedKeys2"
            v-model:openKeys="openKeys"
            mode="inline"
            style="height: 100%"
          >
            <Menu.SubMenu key="sub1" title="Subnav 1">
              <Menu.Item key="1">Option 1</Menu.Item>
              <Menu.Item key="2">Option 2</Menu.Item>
              <Menu.Item key="3">Option 3</Menu.Item>
              <Menu.Item key="4">Option 4</Menu.Item>
            </Menu.SubMenu>
            <Menu.SubMenu key="sub2" title="Subnav 2">
              <Menu.Item key="5">Option 5</Menu.Item>
              <Menu.Item key="6">Option 6</Menu.Item>
              <Menu.Item key="7">Option 7</Menu.Item>
              <Menu.Item key="8">Option 8</Menu.Item>
            </Menu.SubMenu>
            <Menu.SubMenu key="sub3" title="Subnav 3">
              <Menu.Item key="9">Option 9</Menu.Item>
              <Menu.Item key="10">Option 10</Menu.Item>
              <Menu.Item key="11">Option 11</Menu.Item>
              <Menu.Item key="12">Option 12</Menu.Item>
            </Menu.SubMenu>
          </Menu>
        </Layout.Sider>
        <Layout.Content :style="{ padding: '0 24px', minHeight: '280px' }">
          Content
        </Layout.Content>
      </Layout>
    </Layout.Content>
    <Layout.Footer style="text-align: center">
      Ant Design ©2018 Created by Ant UED
    </Layout.Footer>
  </Layout>
</template>

<style scoped>
.logo {
  float: left;
  width: 120px;
  height: 31px;
  margin: 16px 24px 16px 0;
  background: rgba(255, 255, 255, 0.3);
}
</style>
