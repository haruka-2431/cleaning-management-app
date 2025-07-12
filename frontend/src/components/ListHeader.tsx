import { OnModalOpen } from "../configs/EditTypeConfig";

type ListHeaderProps = {
  header: (OnModalOpen: OnModalOpen) => React.ReactNode;
  onModalOpen: OnModalOpen;
};

const ListHeader: React.FC<ListHeaderProps> = ({ header, onModalOpen }) => {
  return (
    <thead className="sticky top-0 bg-white z-10 text-xs text-gray-400">
      <tr className="border-b border-gray-500">
        {header(onModalOpen)}
      </tr>
    </thead>
  );
};

export default ListHeader;