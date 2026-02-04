import Modal from './Modal';
import Button from './Button';

interface Props {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onClose: () => void;
  danger?: boolean;
}

export default function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onClose,
  danger
}: Props) {
  return (
    <Modal open={open} onClose={onClose} title={title} description={description} size="sm">
      <div className="flex flex-wrap gap-3">
        <Button variant={danger ? 'danger' : 'primary'} onClick={onConfirm} className="flex-1">
          {confirmLabel}
        </Button>
        <Button variant="outline" onClick={onClose} className="flex-1">
          {cancelLabel}
        </Button>
      </div>
    </Modal>
  );
}
