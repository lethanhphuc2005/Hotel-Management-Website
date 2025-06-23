"use client";

import styles from "@/app/profile/quanly.module.css";

interface Room {
  id: number;
  name: string;
  date: string;
}

interface Props {
  bookedRooms: Room[];
}

const RoomSection = ({ bookedRooms }: Props) => (
  <section className={styles.section}>
    <h3>Phòng đã đặt</h3>
    <ul className={styles.bookedList}>
      {bookedRooms.map((room) => (
        <li key={room.id}>
          {room.name} - Ngày: {room.date}
        </li>
      ))}
    </ul>
  </section>
);

export default RoomSection;
