<script setup>
import { projectFullName } from '@/utils/constants';
import Logo from './logo.vue';

const thisYear = new Date().getFullYear();
</script>

<template>
  <footer class="footer p-10 bg-white text-base-content border-t">
    <aside>
      <Logo />
      <p>
        {{ projectFullName }}<br />&copf; {{ thisYear }}. All rights reserved.
      </p>
    </aside>
    <nav>
      <header class="footer-title">Services</header>
      <a class="link link-hover">Manage</a>
      <a class="link link-hover">Dashboard</a>
    </nav>
    <nav>
      <header class="footer-title">Company</header>
      <a class="link link-hover">About us</a>
      <a class="link link-hover">Contact</a>
    </nav>
    <nav>
      <header class="footer-title">Legal</header>
      <a class="link link-hover">Terms of use</a>
      <a class="link link-hover">Privacy policy</a>
      <a class="link link-hover">Cookie policy</a>
    </nav>
  </footer>
</template>

<style scoped>
/* footer {
    position: fixed;
    bottom: 0;
    width: 100%;
  } */
</style>
@/utils/constants