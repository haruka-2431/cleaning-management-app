import { OnModalOpen } from "../configs/EditTypeDefinitions";

type ListHeaderProps = {
  header: (OnModalOpen: OnModalOpen, extraProps?: any) => React.ReactNode;
  onModalOpen: OnModalOpen;
  extraProps?: any;
};

const ListHeader: React.FC<ListHeaderProps> = ({ header, onModalOpen, extraProps }) => {
  return (
    <thead className="sticky top-0 bg-white z-10 text-xs text-gray-400">
      <tr className="border-b border-gray-500">
        {header(onModalOpen, extraProps)}
      </tr>
    </thead>
  );
};

export default ListHeader;