<script>
  import { goto } from '$app/navigation';

  function navigateToDashboard() {
    goto('/login');
  }
</script>
<nav>
  <button on:click={navigateToDashboard}>Go to Dashboard</button>
</nav>
  
  <style lang="postcss">
    :global(html) {
      background-color: theme(colors.gray.100);
    }
  </style>