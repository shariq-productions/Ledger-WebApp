/**
 * Outstanding Total - shows outstanding for currently filtered transactions (party + till date)
 */
import { useQuery } from 'react-query';
import { transactionAPI } from '../services/api';

interface OutstandingTotalProps {
  partyFilter?: string;
  tillDate?: string | null;
}

export const OutstandingTotal: React.FC<OutstandingTotalProps> = ({
  partyFilter = '',
  tillDate = null,
}) => {
  const { data, isLoading } = useQuery(
    ['outstanding-total', partyFilter, tillDate],
    () =>
      transactionAPI
        .getOutstandingTotal({
          party_filter: partyFilter || undefined,
          date_end: tillDate || undefined,
        })
        .then((res) => res.data),
    { refetchInterval: 5000 }
  );

  const total = data?.total ?? 0;

  return (
    <div className="bg-blue-600 text-white rounded-lg shadow-lg p-6 min-w-[200px]">
      <h2 className="text-sm font-medium mb-2 opacity-90">Total Outstanding</h2>
      <div className="text-3xl font-bold">
        {isLoading ? '...' : `₹${total.toLocaleString('en-IN')}`}
      </div>
    </div>
  );
};
