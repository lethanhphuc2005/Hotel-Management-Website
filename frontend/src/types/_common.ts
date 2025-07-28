import { Range } from "react-date-range";

export interface PaginationResponse {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface DateRange extends Range {}

export interface GuestCount {
  adults: number;
  children: {
    age0to6: number;
    age7to17: number;
  };
}

export interface SearchBar {
  dateRange: DateRange[];
  setDateRange: (range: DateRange[]) => void;
  guests: GuestCount;
  setGuests: React.Dispatch<React.SetStateAction<GuestCount>>;
  price: number;
  setPrice: React.Dispatch<React.SetStateAction<number>>;
  showCalendar: boolean;
  setShowCalendar: React.Dispatch<React.SetStateAction<boolean>>;
  showGuestBox: boolean;
  setShowGuestBox: React.Dispatch<React.SetStateAction<boolean>>;
  guestBoxRef: React.RefObject<HTMLDivElement | null>;
  calendarRef: React.RefObject<HTMLDivElement | null>;
  totalGuests: number;
  numberOfAdults: number;
  numberOfChildren: number;
  numberOfNights: number;
  totalPrice: number;
  hasSearched: boolean;
  setHasSearched: React.Dispatch<React.SetStateAction<boolean>>;
  handleSearch: () => void;
}

export interface RoomSearchBarProps extends SearchBar {}