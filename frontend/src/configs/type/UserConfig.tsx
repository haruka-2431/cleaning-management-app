import { EditConfig, ContentEditModalProps, UserItem } from "../EditTypeDefinitions"
import { FormField } from "../../components/FormField";

export const userConfig: EditConfig<UserItem, ContentEditModalProps> = {
  title: "個人データ",
  header: () => (
    <>
      <th>ユーザー名</th>
      <th>メールアドレス</th>
      <th className="hidden lg:table-cell">ロール</th>
      <th>
      </th>
    </>
  ),
  row: (item, onModalOpen) => {
    const [userName, domain] = item.email.split("@");
    return (
      <>
        <td>{item.last_name + item.first_name}</td>
        <td>{userName}<br className="lg:hidden" />@{domain}</td>
        <td className="hidden lg:table-cell">{item.position}</td>
        <td>
          <div className="flex gap-2 justify-center">
            {item.status ? 
              <>
                <button
                  className="px-2 py-1 bg-teal-600 text-white rounded"
                  onClick={() => onModalOpen("update", item.id, item.last_name, item.first_name, item.email, item.position)}
                >
                  変更
                </button>
                <button
                  className="px-2 py-1 bg-red-600 text-white rounded"
                  onClick={() => onModalOpen("delete", item.id, item.last_name, item.first_name, item.email, item.position)}
                >
                  削除
                </button>
              </> : 
              <button
                className="w-30 h-7.5 flex justify-center items-center border rounded border-cyan-600"
                onClick={() => onModalOpen("authentication", item.id, item.last_name, item.first_name, item.email, item.position, item.status)}
              >
                未認証
              </button>
            }
          </div>
        </td>
      </>
    );
  },
  modals: {
    authentication: (props: ContentEditModalProps) => (
      <div className="mt-7.5 mb-15 w-55">
        <p className="text-sm text-gray-700">このユーザーを承認しますか？</p>
        <div className="p-[2px] border rounded-lg border-gray-500">
          {props.inputValue.slice(0, -1).map((_, index) => 
            <FormField
              key={index}
              index={index}
              inputValue={props.inputValue}
              setInputValue={props.setInputValue}
              valueBefore={props.valueBefore}
              isInput={true}
            />
          )}
        </div>
      </div>
    ),
    update: (props: ContentEditModalProps) => (
      <div className="mt-7.5 mb-15 w-55">
        <div>
          <p className="py-2 text-xs text-gray-700">変更前</p>
          {props.valueBefore.map((_, index) => 
            <FormField
              key={index}
              index={index}
              inputValue={props.inputValue}
              setInputValue={props.setInputValue}
              valueBefore={props.valueBefore}
              isInput={false}
            />
          )}
        </div>
        <div className="mt-6 mb-1 flex justify-center text-black">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 7.5 7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5" />
          </svg>
        </div>
        <div>
          <p className="px-1 py-2 text-xs text-gray-700">変更後</p>
          {props.inputValue.map((_, index) => 
            <FormField
              key={index}
              index={index}
              inputValue={props.inputValue}
              setInputValue={props.setInputValue}
              valueBefore={props.valueBefore}
              isInput={true}
            />
          )}
        </div>
      </div>
    ),
    delete: (props: ContentEditModalProps) => (
      <div className="mt-12.5 mb-25 w-55">
        <p className="px-1 py-2 text-sm text-gray-700">削除項目</p>
        <div className="p-[2px] border rounded-lg border-gray-500">
          {props.inputValue.map((_, index) => 
            <FormField
              key={index}
              index={index}
              inputValue={props.inputValue}
              setInputValue={props.setInputValue}
              valueBefore={props.valueBefore}
              isInput={false}
            />
          )}
        </div>
      </div>
    )
  }
};