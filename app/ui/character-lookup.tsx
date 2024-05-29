'use client';

import { useSearchParams, usePathname, useRouter } from 'next/navigation';

export default function CharacterLookup() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const onChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    //    alert(event.target.value + ' ' + event.target.name);
    const params = new URLSearchParams(searchParams);
    if (event.target.value) {
      params.set(event.target.name, event.target.value);
    } else {
      params.delete(event.target.name);
    }
    replace(`${pathname}?${params.toString()}`);
  };
  const characters = [
    { value: 'alef', text: '\u05d0' },
    { value: 'bet', text: '\u05d1' },
    { value: 'gimel', text: '\u05d2' },
  ];
  return (
    <>
      <label>Fourth Root</label>
      <select id="root4" name="root4" onChange={onChange}>
        {characters.map((char) => (
          <option key={char.value} value={char.value}>
            {char.text}
          </option>
        ))}
      </select>
      <label>Third Root</label>
      <select id="root3" name="root3" onChange={onChange}>
        <option value="alef">&#x5d0;</option>
        <option value="bet">&#x5d1;</option>
        <option value="gimel">&#x5d2;</option>
      </select>
      <label>Second Root</label>
      <select id="root2" name="root2" onChange={onChange}>
        <option value="alef">&#x5d0;</option>
        <option value="bet">&#x5d1;</option>
        <option value="gimel">&#x5d2;</option>
      </select>
      <label>First Root</label>
      <select id="root1" name="root1" onChange={onChange}>
        <option value="alef">&#x5d0;</option>
        <option value="bet">&#x5d1;</option>
        <option value="gimel">&#x5d2;</option>
      </select>
    </>
  );
}
