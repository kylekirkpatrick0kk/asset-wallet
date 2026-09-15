declare module 'vue3-easy-data-table' {
  import type { DefineComponent } from 'vue';

  const DataTable: DefineComponent<Record<string, unknown>, Record<string, unknown>, unknown>;
  export default DataTable;
}