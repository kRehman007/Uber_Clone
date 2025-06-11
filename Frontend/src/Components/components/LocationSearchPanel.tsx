import { FaLocationDot } from "react-icons/fa6";
import { ScrollArea } from "../ui/scroll-area";
import { SuggestionsResponse } from "../Redux/RTK/GoogleMapAPI";

interface LocationSearchPanelProps {
  setVehiclePanelOpen: (value: boolean) => void;
  setPanelopen: (value: boolean) => void;
  suggestions: SuggestionsResponse;
  onSuggestionClick: (suggestion: string) => void;
}

const LocationSearchPanel: React.FC<LocationSearchPanelProps> = ({
  suggestions,
  onSuggestionClick,
}) => {
  return (
    <>
      <ScrollArea className="h-[100%]  overflow-y-auto">
        {suggestions?.map((suggestion, index) => (
          <div
            className="flex gap-7 border acitve:border-2 flex-start  rounded-lg active:border-black p-3 items-center  my-2"
            key={index}
            onClick={() => {
              onSuggestionClick(suggestion.display_name);
            }}
          >
            <h2 className=" flex items-center justify-center rounded-full">
              <FaLocationDot className="text-medium md:text-xl" />
            </h2>
            <p className="font-medium text-xs md:text-sm">
              {suggestion.display_name}
            </p>
          </div>
        ))}
      </ScrollArea>
    </>
  );
};

export default LocationSearchPanel;
