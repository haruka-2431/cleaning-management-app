type DeleteModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

const DeleteModal = ({ isOpen, onClose, onConfirm }: DeleteModalProps) => {
  if(!isOpen) return null;

  const handleDelete = () => {
    onConfirm();
    onClose();
  };

  return (
    <dialog open={isOpen} className="modal modal-middle">
      <div className="modal-box">
        <h3 className="font-bold text-lg">本当に削除しますか？</h3>
        <p className="py-4">この操作は取り消せません。</p>
        <div className="modal-action">
          <form method="dialog">
            <button onClick={onClose} className="btn">
              戻る
            </button>
          </form>
          <button onClick={handleDelete} className="btn btn-error ml-2">
            削除する
          </button>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={onClose}>close</button>
      </form>
    </dialog>
  );
};

export default DeleteModal;