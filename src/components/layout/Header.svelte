<script lang="ts">
import TopAppBar, { Row, Title, Section, AutoAdjust } from '@smui/top-app-bar'
</script>

<div class="header">
  <TopAppBar variant="static" dense>
    <Row>
      <Section>
        <Title>Cloud Translation</Title>
      </Section>
      <Section align="end" toolbar>
        <!-- <IconButton class="material-icons" aria-label="Download">file_download</IconButton>
        <IconButton class="material-icons" aria-label="Print this page">print</IconButton>
        <IconButton class="material-icons" aria-label="Bookmark this page">bookmark</IconButton> -->
      </Section>
    </Row>
  </TopAppBar>
</div>

<style>
/* Hide everything above this component. */
:global(app),
:global(body),
:global(html) {
  display: block !important;
  height: auto !important;
  width: auto !important;
  position: static !important;
}
</style>
