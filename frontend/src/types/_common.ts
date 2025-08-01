import { Range } from "react-date-range";

export interface PaginationResponse {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  averageRating?: number; // Optional, used in reviews
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
  pendingDateRange: DateRange[];
  setPendingDateRange: (range: DateRange[]) => void;
  dateRange: DateRange[];
  setDateRange: (range: DateRange[]) => void;
  hasSaturdayNight?: boolean;
  hasSundayNight?: boolean;
  capacity: number;
  pendingGuests: GuestCount;
  setPendingGuests: React.Dispatch<React.SetStateAction<GuestCount>>;
  guests: GuestCount;
  setGuests: React.Dispatch<React.SetStateAction<GuestCount>>;
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
  hasSearched: boolean;
  setHasSearched: React.Dispatch<React.SetStateAction<boolean>>;
  handleSearch: () => void;
  handleResetSearch?: () => void;
}

export interface RoomSearchBarProps extends SearchBar {}