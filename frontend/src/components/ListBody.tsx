import { OnModalOpen } from "../configs/EditTypeDefinitions";

type ListBodyProps<T> = {
  data: T[];
  row: (item: T, onModalOpen: OnModalOpen) => React.ReactNode;
  onModalOpen: OnModalOpen;
};

const ListBody = <T,>({ data, row, onModalOpen }: ListBodyProps<T>) => {
  return (
    <tbody className="text-black">
      {data.map((item) => (
        <tr key={(item as any).id} className="border-b border-gray-300">
          {row(item,onModalOpen)}
        </tr>
      ))}
    </tbody>
  );
};

export default ListBody;
