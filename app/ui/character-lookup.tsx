'use client';

import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { getAvailableRoots } from '../lib/actions';
import { Button } from './button';
import Link from 'next/link';

interface CharacterOption {
  value: string;
  text: string;
}
export default function CharacterLookup() {
  const searchParams = useSearchParams();
  const [selectedValues, setSelectedValues] = useState({
    root1: '',
    root2: '',
    root3: '',
    root4: '',
  });
  const [firstOptions, setFirstOptions] = useState<Array<CharacterOption>>([]);
  const [secondOptions, setsecondOptions] = useState<Array<CharacterOption>>(
    [],
  );
  const [thirdOptions, setthirdOptions] = useState<Array<CharacterOption>>([]);
  const [fourthOptions, setfourthOptions] = useState<Array<CharacterOption>>(
    [],
  );

  const onClick = () => {

  }

  if (firstOptions.length === 0) {
    const root1 = searchParams.get('root1');
    const root2 = searchParams.get('root2');
    const root3 = searchParams.get('root3');
    getAvailableRoots().then((values) => {
      setFirstOptions(values);
    });
    getAvailableRoots(root1).then((values) => {
      setsecondOptions(values);
    });
    getAvailableRoots(root1, root2).then((values) => {
      setthirdOptions(values);
    });
    getAvailableRoots(root1, root2, root3).then((values) => {
      setfourthOptions(values);
    });
  }
  const updateParams = async (root: string, value: string) => {
    if (root === 'root1') {
      getAvailableRoots(value).then((values) => {
        setsecondOptions(values);
        selectedValues.root1 = value;
        setSelectedValues(selectedValues);
      });
    }
    if (root === 'root2') {
      getAvailableRoots(selectedValues.root1, value).then((values) => {
        setthirdOptions(values);
        selectedValues.root2 = value;
        setSelectedValues(selectedValues);
      });
    }
    if (root === 'root3') {
      getAvailableRoots(selectedValues.root1, selectedValues.root2, value).then(
        (values) => {
          setfourthOptions(values);
          selectedValues.root3 = value;
          setSelectedValues(selectedValues);
        },
      );
    }
  };
  return (
    <>
      <div>
        <RootDropDown
          id="root4"
          options={fourthOptions}
          label="Fourth Root"
          onChangea={updateParams}
        />
        <RootDropDown
          id="root3"
          options={thirdOptions}
          label="Third Root"
          onChangea={updateParams}
        />
        <RootDropDown
          id="root2"
          options={secondOptions}
          label="Second Root"
          onChangea={updateParams}
        />
        <RootDropDown
          id="root1"
          options={firstOptions}
          label="First Root"
          onChangea={updateParams}
        /></div>
      <div><Button><Link href={"lookup/" + selectedValues.root1 + (selectedValues.root2 ? "/" + selectedValues.root2 + (selectedValues.root3 ? "/" + selectedValues.root3 + (selectedValues.root4 ? "/" + selectedValues.root4 : "") : "") : "")}>Search</Link></Button></div>
    </>
  );
}

export function RootDropDown({
  id,
  options,
  label,
  onChangea,
}: {
  id: string;
  options: CharacterOption[];
  label: string;
  onChangea: (root: string, value: string) => void;
}) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const params = new URLSearchParams(searchParams);
  const onChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    if (event.target.value) {
      params.set(event.target.name, event.target.value);
    } else {
      params.delete(event.target.name);
    }
    replace(`${pathname}?${params.toString()}`);
    onChangea(event.target.name, event.target.value);
  };
  return (
    <>
      <label>{label}</label>
      <select id={id} name={id} onChange={onChange}>
        {options.map((char) => (
          <option
            key={char.value}
            value={char.value}
            selected={char.value === params.get(id)}
          >
            {char.text}
          </option>
        ))}
      </select>
    </>
  );
}
