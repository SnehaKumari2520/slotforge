import axios from "axios";
export interface Slot {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
}

export interface CreateSlotInput {
  title: string;
  startTime: string;
  endTime: string;
}

const API_BASE_URL = "https://slotforge-f5fs.onrender.com/api";

export const fetchSlots = async (): Promise<Slot[]> => {
  const response = await axios.get<Slot[]>(`${API_BASE_URL}/slots`);
  return response.data;
};

export const createSlot = async (slotData: CreateSlotInput): Promise<Slot> => {
  const response = await axios.post<Slot>(`${API_BASE_URL}/slots`, slotData);
  return response.data;
};

export const deleteSlot = async (id: string): Promise<void> => {
  await axios.delete(`${API_BASE_URL}/slots/${id}`);
};