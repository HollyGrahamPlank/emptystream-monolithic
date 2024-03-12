import { Button, Drawer, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import styles from "./DeveloperPanel.module.css";
import UploadTransmission from "./UploadTransmission";

export default function DeveloperPanel() {
  const [opened, { open, close }] = useDisclosure(false);

  const uploadTransmissionModal = () =>
    modals.open({
      title: <Text size="lg">Upload a new Transmission to `emptystream`</Text>,
      children: <UploadTransmission />,
    });

  return (
    <div className={styles.container}>
      <Drawer
        opened={opened}
        onClose={close}
        title="Developer Panel"
        position="right"
        overlayProps={{ backgroundOpacity: 0.5, blur: 2 }}
      >
        <Button onClick={uploadTransmissionModal}>Upload Transmission</Button>
      </Drawer>

      <Button className={styles.devPanelButton} onClick={open}>
        Developer Panel
      </Button>
    </div>
  );
}
