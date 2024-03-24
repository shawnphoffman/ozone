import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import {
  CheckCircleIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from '@heroicons/react/20/solid'
import { SubjectStatus } from '@/lib/types'
import { LoadMoreButton } from '../common/LoadMoreButton'
import { classNames } from '@/lib/util'
import { SubjectOverview } from '../reports/SubjectOverview'
import { Loading } from '../common/Loader'
import { useSearchParams, usePathname } from 'next/navigation'
import { HTMLAttributes } from 'react'
import { ReviewStateIcon } from './ReviewStateMarker'

const useSortOrder = () => {
  const searchParams = useSearchParams()
  const pathname = usePathname()

  const directionKey = 'sortDirection'
  const fieldKey = 'sortField'
  const sortDirection = searchParams.get(directionKey)
  const sortField = searchParams.get(fieldKey)

  function getToggleReverseOrderLink(field: string) {
    const params = new URLSearchParams(searchParams)
    params.set(directionKey, sortDirection === 'asc' ? 'desc' : 'asc')
    params.set(fieldKey, field)
    return `${pathname}?${params}`
  }

  return { sortDirection, sortField, getToggleReverseOrderLink }
}

export function SubjectTable(
  props: {
    subjectStatuses: SubjectStatus[]
    showLoadMore: boolean
    isInitialLoading: boolean
    onLoadMore: () => void
  } & HTMLAttributes<HTMLDivElement>,
) {
  const {
    subjectStatuses,
    showLoadMore,
    onLoadMore,
    isInitialLoading,
    className,
    ...rest
  } = props
  return (
    <div className={classNames('px-4 sm:px-6 lg:px-8', className)} {...rest}>
      <div className="-mx-4 overflow-hidden border border-gray-300 sm:-mx-6 md:mx-0 md:rounded-lg">
        <table className="min-w-full divide-y divide-gray-300">
          <thead className="bg-white dark:bg-slate-800">
            <SubjectRowHead />
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 dark:bg-slate-800">
            {!subjectStatuses.length && (
              <EmptyRows isInitialLoading={isInitialLoading} />
            )}
            {subjectStatuses.map((subjectStatus) => (
              <SubjectRow
                key={subjectStatus.id}
                subjectStatus={subjectStatus}
              />
            ))}
          </tbody>
        </table>
      </div>
      {showLoadMore && (
        <div className="flex justify-center py-6">
          <LoadMoreButton onClick={onLoadMore} />
        </div>
      )}
    </div>
  )
}

function SubjectRow({
  subjectStatus,
  ...others
}: { subjectStatus: SubjectStatus } & HTMLAttributes<HTMLTableRowElement>) {
  const createdAt = subjectStatus.createdAt
    ? new Date(subjectStatus.createdAt)
    : null
  const lastReviewedAt = subjectStatus.lastReviewedAt
    ? new Date(subjectStatus.lastReviewedAt)
    : null
  const lastReportedAt = subjectStatus.lastReportedAt
    ? new Date(subjectStatus.lastReportedAt)
    : null

  return (
    <tr {...others}>
      <td className="w-full py-4 pl-4 pr-3 text-sm font-medium text-gray-900 max-w-0 dark:text-gray-200 sm:w-auto sm:max-w-none sm:pl-6 sm:hidden">
        <div className="flex flex-row items-center pb-1">
          <ReviewStateIcon
            subjectStatus={subjectStatus}
            className="w-4 h-4 mr-1"
          />{' '}
          <SubjectOverview
            subject={subjectStatus.subject}
            subjectRepoHandle={subjectStatus.subjectRepoHandle}
            withTruncation={false}
          />
        </div>
        <dl className="font-normal">
          {createdAt && (
            <div className="flex flex-row items-center">
              <dt>Created</dt>
              <dd className="ml-1 text-gray-700 truncate dark:text-gray-100">
                {formatDistanceToNow(createdAt, { addSuffix: true })}
              </dd>
            </div>
          )}
          {lastReviewedAt && (
            <div className="flex flex-row items-center">
              <dt>Last Reviewed</dt>
              <dd className="ml-1 text-gray-700 truncate dark:text-gray-100">
                {formatDistanceToNow(lastReviewedAt, { addSuffix: true })}
              </dd>
            </div>
          )}
          {lastReportedAt && (
            <div className="flex flex-row items-center">
              <dt>Last Reported</dt>
              <dd className="ml-1 text-gray-700 truncate dark:text-gray-100">
                {formatDistanceToNow(lastReportedAt, { addSuffix: true })}
              </dd>
            </div>
          )}
          {!!subjectStatus?.comment && (
            <div className="flex flex-row items-center">
              <dt>Comment</dt>
              <dd className="ml-1 text-gray-700 truncate dark:text-gray-100">
                {subjectStatus.comment}
              </dd>
            </div>
          )}
        </dl>
      </td>
      <td className="hidden px-3 py-4 text-sm text-center text-gray-500 dark:text-gray-100 sm:table-cell">
        <ReviewStateIcon subjectStatus={subjectStatus} className="w-5 h-5" />
      </td>
      <td className="hidden px-3 py-4 text-sm text-gray-500 dark:text-gray-100 sm:table-cell">
        <SubjectOverview
          subject={subjectStatus.subject}
          subjectRepoHandle={subjectStatus.subjectRepoHandle}
        />
      </td>
      <td className="hidden px-3 py-4 text-sm text-gray-500 dark:text-gray-100 sm:table-cell">
        {createdAt && (
          <span title={createdAt.toLocaleString()}>
            {formatDistanceToNow(createdAt, { addSuffix: true })}
          </span>
        )}
      </td>
      <td className="hidden px-3 py-4 text-sm text-gray-500 dark:text-gray-100 sm:table-cell max-w-sm">
        {lastReviewedAt && (
          <span title={lastReviewedAt.toLocaleString()}>
            {formatDistanceToNow(lastReviewedAt, { addSuffix: true })}
          </span>
        )}
        {!!subjectStatus?.comment && (
          <>
            <br />
            <span>{subjectStatus.comment}</span>
          </>
        )}
      </td>
      <td className="hidden px-3 py-4 text-sm text-gray-500 dark:text-gray-100 sm:table-cell">
        {lastReportedAt && (
          <span title={lastReportedAt.toLocaleString()}>
            {formatDistanceToNow(lastReportedAt, { addSuffix: true })}
          </span>
        )}
      </td>
    </tr>
  )
}

function SubjectRowHead() {
  const { sortDirection, sortField, getToggleReverseOrderLink } = useSortOrder()

  return (
    <tr>
      <th
        scope="col"
        className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-200 sm:pl-6 sm:hidden"
      >
        <span className="sr-only">Id</span>
      </th>
      <th
        scope="col"
        className="hidden px-3 py-3.5 text-center text-sm font-semibold text-gray-900 dark:text-gray-200 sm:table-cell"
      >
        Status
      </th>
      <th
        scope="col"
        className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-200 sm:table-cell"
      >
        Subject
      </th>
      <th
        scope="col"
        className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-200 sm:table-cell"
      >
        {/* <Link prefetch={false} href={getToggleReverseOrderLink('createdAt')}> */}
        Created
        {sortField === 'createdAt' &&
          (sortDirection === 'asc' ? (
            <ChevronUpIcon className="inline-block w-4 h-4 align-text-bottom" />
          ) : (
            <ChevronDownIcon className="inline-block w-4 h-4 align-text-bottom" />
          ))}
        {/* </Link> */}
      </th>
      <th
        scope="col"
        className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-200 sm:table-cell"
      >
        <Link
          prefetch={false}
          href={getToggleReverseOrderLink('lastReviewedAt')}
        >
          Last Reviewed/Note
          {sortField === 'lastReviewedAt' &&
            (sortDirection === 'asc' ? (
              <ChevronUpIcon className="inline-block w-4 h-4 align-text-bottom" />
            ) : (
              <ChevronDownIcon className="inline-block w-4 h-4 align-text-bottom" />
            ))}
        </Link>
      </th>
      <th
        scope="col"
        className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-200 sm:table-cell"
      >
        <Link
          prefetch={false}
          href={getToggleReverseOrderLink('lastReportedAt')}
        >
          Last Reported
          {sortField === 'lastReportedAt' &&
            (sortDirection === 'asc' ? (
              <ChevronUpIcon className="inline-block w-4 h-4 align-text-bottom" />
            ) : (
              <ChevronDownIcon className="inline-block w-4 h-4 align-text-bottom" />
            ))}
        </Link>
      </th>
    </tr>
  )
}

function EmptyRows({ isInitialLoading }: { isInitialLoading: boolean }) {
  return (
    <tr>
      <td colSpan={5} className="text-center">
        {isInitialLoading ? (
          <>
            <Loading />
            <p className="pb-4 text-gray-400 dark:text-gray-100">
              Loading moderation queue...
            </p>
          </>
        ) : (
          <p className="py-4 text-center text-gray-400 dark:text-gray-100">
            <CheckCircleIcon
              title="No reports"
              className="w-10 h-10 mx-auto mb-4 text-green-300 align-text-bottom"
            />
            Moderation queue is empty
          </p>
        )}
      </td>
    </tr>
  )
}
