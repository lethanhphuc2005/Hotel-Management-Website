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
  showCalendar: boolean;
  setShowCalendar: (show: boolean) => void;
  showGuestBox: boolean;
  setShowGuestBox: (show: boolean) => void;
  guestBoxRef: React.RefObject<HTMLDivElement | null>;
  calendarRef: React.RefObject<HTMLDivElement | null>;
  maxGuests: number;
  setMaxGuests: React.Dispatch<React.SetStateAction<number>>;
  totalGuests: number;
  numberOfNights: number;
  setNumberOfNights: React.Dispatch<React.SetStateAction<number>>;
  totalPrice: number;
  setTotalPrice: React.Dispatch<React.SetStateAction<number>>;
  hasSearched: boolean;
  setHasSearched: React.Dispatch<React.SetStateAction<boolean>>;
  numberOfAdults?: number;
  numberOfChildren?: number;
  pendingGuests: GuestCount;
  setPendingGuests: React.Dispatch<React.SetStateAction<GuestCount>>;
  pendingDateRange: DateRange[] | null;
  setPendingDateRange: React.Dispatch<React.SetStateAction<DateRange[] | null>>;
  startDate: Date;
  setStartDate: React.Dispatch<React.SetStateAction<Date>>;
  endDate: Date;
  setEndDate: React.Dispatch<React.SetStateAction<Date>>;
  numAdults?: number;
  numChildrenUnder6?: number;
  numChildrenOver6?: number;
  totalEffectiveGuests?: number;
  showExtraBedOver6?: boolean;
  handleSearch?: () => void;
  price: number;
  setPrice: React.Dispatch<React.SetStateAction<number>>;
}
