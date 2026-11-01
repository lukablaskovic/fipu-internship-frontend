# FIPU BPMN renderer snapshot

`fipu-bpmn` is copied from the standalone [fipu-bpmn-studio](https://github.com/lukablaskovic/fipu-bpmn-studio) repository by the parent workspace's `make bpmn-sync` command. Edit the Studio source, synchronize, and run `make bpmn-check`; do not edit the snapshot directly.

The local file dependency keeps dashboard builds self-contained, including Docker builds, without bundling the Studio editor application. The dashboard uses only the XML toolkit and read-only renderer. No Camunda or bpmn-js runtime is required.
