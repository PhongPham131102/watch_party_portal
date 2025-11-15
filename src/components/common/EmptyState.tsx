interface EmptyStateProps {
  message: string;
  description?: string;
  colSpan?: number;
}

export function EmptyState({ message, description, colSpan = 5 }: EmptyStateProps) {
  return (
    <tr>
      <td colSpan={colSpan} className="px-6 py-16">
        <div className="flex flex-col items-center justify-center text-center">
          <p className="text-gray-600 dark:text-gray-400 font-medium">
            {message}
          </p>
          {description && (
            <p className="text-gray-400 text-sm mt-1">
              {description}
            </p>
          )}
        </div>
      </td>
    </tr>
  );
}
