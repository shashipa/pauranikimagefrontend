// app/img_list_frontend/page.js

import Img_Client from './client';
import { cookies } from 'next/headers';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? 'https://pauranikart.com/api/v1';

// ✅ these are allowed at the top level (not inside "use server" scope)
export const dynamic = 'force-dynamic'; 
export const revalidate = 0;

async function getFirstPage({ page = 1, limit = 24 }) {
  const url = new URL(`${API_BASE}/getImage`);
  url.searchParams.set('page', String(page));
  url.searchParams.set('limit', String(limit));

  const res = await fetch(url, { cache: 'no-store', headers: { Accept: 'application/json' } });
  if (!res.ok) return { success: false, totalCount: 0, totalPages: 1, data: [] };

  const json = await res.json();
  return {
    success: !!json?.success,
    totalCount: Number(json?.totalCount ?? 0),
    totalPages: Number(json?.totalPages ?? 1),
    currentPage: Number(json?.currentPage ?? page),
    data: Array.isArray(json?.data) ? json.data : [],
  };
}

export default async function Img_Page() {
  const cookieStore = cookies();
  const userId = cookieStore.get('userId')?.value ?? null;

  // fetch limited first page
  const initialData = await getFirstPage({ page: 1, limit: 24 });

  return (
    <>
      <Img_Client initialData={initialData} userId={userId} />
    </>
  );
}
