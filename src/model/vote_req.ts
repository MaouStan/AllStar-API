export interface VoteRequest {
  userId: number | null;
  winnerId: number;
  loserId: number;
}