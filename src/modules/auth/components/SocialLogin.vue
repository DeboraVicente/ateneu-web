<template>
  <div class="social-btns">
    <button class="social-btn" type="button" @click="$emit('login', 'Google')">
      <svg viewBox="0 0 24 24">...</svg> Google
    </button>
    <button class="social-btn" type="button" @click="$emit('login', 'Facebook')">
      <svg viewBox="0 0 24 24">...</svg> Facebook
    </button>
  </div>
</template>