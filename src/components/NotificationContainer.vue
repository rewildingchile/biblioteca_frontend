<template>
  <div class="notification-container">
    <div
      v-for="n in notifications"
      :key="n.id"
      :class="alertClass(n.type)"
      class="notification"
    >
      {{ n.message }}
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  computed: {
    ...mapState("notifications", ["messages"]),
    notifications() {
      return this.messages;
    }
  },
  methods: {
    alertClass(type) {
      switch (type) {
        case "error":
          return "alert alert-danger";
        case "success":
          return "alert alert-success";
        case "warning":
          return "alert alert-warning";
        default:
          return "alert alert-info";
      }
    }
  }
};
</script>

<style scoped>
.notification-container {
  position: fixed;
  top: 20px;
  right: 20px;
  width: 320px;
  z-index: 9999;
}

.notification {
  margin-bottom: 10px;
  color:yellow
}
</style>