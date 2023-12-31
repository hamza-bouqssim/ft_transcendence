import {
  OverlayStyle,
  OverlayStyleSearching,
  SearchResultStyling,
} from "../../../utils/styles";
import { CreateConversationForm } from "../../forms/CreateConversationForm";
import {
  Dispatch,
  FC,
  createRef,
  useContext,
  useEffect,
  useState,
} from "react";
import { MdClose } from "react-icons/md";
import { createConversation } from "../../../utils/api";
import { CreateSearchForm } from "../../forms/CreateSearchForm";
import { ModalContainer, ModalContentBody, ModalHeader } from "../../modals";
import {
  ModalContainerSearching,
  ModalContentBodySearching,
  ModalHeaderSearching,
} from ".";
import {
  ConversationTypes,
  CreateConversationParams,
  UsersTypes,
} from "../../../utils/types";
import { useAppDispatch } from "@/redux_toolkit/hooks";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { socketContext } from "../../../utils/context/socketContext";
import { useRouter } from "next/navigation";

type props = {
  setShow: Dispatch<React.SetStateAction<Boolean>>;
};

const CreateSearchModal: FC<props> = ({ setShow }) => {
  const ref = createRef<HTMLDivElement>();
  // const [show, setShow] = useState<any>(false);
  const { updateChannel, channel } = useContext(socketContext);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateConversationParams>();
  const dispatch = useDispatch < useAppDispatch();

  const onSubmit = async (data: CreateConversationParams) => {};

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<UsersTypes[]>([]);
  const router = useRouter();
  const { Userdata } = useContext(socketContext);

  useEffect(() => {
    // Define a function to fetch search results
    const fetchSearchResults = async () => {
      try {
        const response = await fetch(`http://10.11.6.2:8000/user/search`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name: searchQuery }),
        });
        if (response.ok) {
          const data = await response.json();
          setSearchResults(data.data);
        }
      } catch (error) {
        console.error("Error fetching search results:", error);
      }
    };

    if (searchQuery.trim() !== "") {
      fetchSearchResults();
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) =>
      e.key === "Escape" && setShow(false);
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [setShow]);

  const handleOverlayClick = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    const { current } = ref;
    if (current === e.target) {
    }
  };
  const updatePage = (elem: ConversationTypes) => {
    router.push("/dashboard/groups");

    updateChannel(elem);
  };
  // function isUsersTypes(elem: ConversationTypes | UsersTypes): elem is UsersTypes {
  // 		return (elem as UsersTypes).display_name !== undefined;
  // 	}

  //   function isGroupChannel(elem: ConversationTypes | UsersTypes): elem is ConversationTypes {
  //     return (elem as ConversationTypes).name !== undefined;
  //   }

  return (
    <div className="w-full max-w-screen-xl mx-auto px-6">
      <div className="flex justify-center p-4 px-3 py-10">
        <div className="w-full max-w-md">
          <div className="bg-white shadow-md rounded-lg px-3 py-2 mb-4">
            <div className="block text-gray-700 text-lg font-semibold py-7 px-2 items-center font-['Whitney_Semibold']">
              Searching
            </div>
            <div className="flex items-center bg-gray-200 rounded-md">
              <div className="pl-2">
                <svg
                  className="fill-current text-gray-500 w-6 h-6"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                >
                  <path
                    className="heroicon-ui"
                    d="M16.32 14.9l5.39 5.4a1 1 0 0 1-1.42 1.4l-5.38-5.38a8 8 0 1 1 1.41-1.41zM10 16a6 6 0 1 0 0-12 6 6 0 0 0 0 12z"
                  />
                </svg>
              </div>
              <input
                className="w-full rounded-md bg-gray-200 text-gray-700 leading-tight focus:outline-none py-2 px-2"
                id="search"
                type="text"
                placeholder="Search teams or members"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="py-3 text-sm">
              {searchResults.map((elem) => (
                <div
                  key={elem.id}
                  className="flex justify-start cursor-pointer text-gray-700 hover:text-blue-400 hover:bg-blue-100 rounded-md px-2 py-2 my-2"
                >
                  <span className="bg-gray-400 h-2 w-2 m-2 rounded-full"></span>
                  <div className="flex-grow font-medium px-2 font-['Whitney_Semibold']">
                    <Link href={`/dashboard/${elem.id}`}>
                      {elem.display_name}
                    </Link>
                  </div>
                </div>
              ))}
            </div>
            <div className="block bg-gray-200 text-sm text-right py-2 px-3 -mx-3 -mb-2 rounded-b-lg">
              <button
                className="hover:text-gray-600 text-gray-500 font-bold py-2 px-4"
                onClick={() => {
                  setShow(false);
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateSearchModal;
