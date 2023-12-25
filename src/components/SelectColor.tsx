"use client";
import { useCart } from "@/hooks/useCart";
import { useCallback, useEffect, useRef, useState } from "react";
import SelectImage from "./SelectImage";
import Button from "./Button";

interface Props {
  item: ImageType;
  isProductCreated: boolean;
  imageUploadProgress: number;
  addImageToLocalState: (value: ImageType) => void;
  removeImageFromLocalState: (value: ImageType) => void;
}

const SelectColor = ({
  item,
  isProductCreated,
  addImageToLocalState,
  removeImageFromLocalState,
  imageUploadProgress,
}: Props) => {
  const [selected, setSelected] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    if (isProductCreated) {
      setSelected(false);
      setFile(null);
    }
  }, [isProductCreated]);

  const handleFileChange = useCallback((file: File) => {
    setFile(file);
    addImageToLocalState({ ...item, image: file });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCheck = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSelected(e.target.checked);
    if (!e.target.checked) {
      setFile(null);
      removeImageFromLocalState(item);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="grid grid-cols-1 overflow-y-auto border-b-[1.2px] border-slate-200 items-center p-2">
      <div className="flex flex-row gap-2 items-center h-[60px]">
        <input
          type="checkbox"
          id={item.color}
          checked={selected}
          className="cursor-pointer"
          onChange={handleCheck}
        />
        <label htmlFor={item.color} className="font-medium cursor-pointer">
          {item.color}
        </label>
      </div>

      {/* image selection */}
      {selected && !file && (
        <div className="col-span-2 text-center">
          <SelectImage item={item} handleFileChange={handleFileChange} />
        </div>
      )}

      {/* if we have file */}
      {file && (
        <div className="flex flex-col gap-1">
          <div className="flex flex-row gap-2 text-sm col-span-2 items-center justify-between">
            <p>{file.name}</p>
            <Button
              small
              outline
              label="Cancel"
              onClick={() => {
                setFile(null);
                removeImageFromLocalState(item);
                setSelected(false);
              }}
            />
          </div>
          {imageUploadProgress > 0 && (
            <progress
              className="progress progress-secondary w-full"
              value={imageUploadProgress}
              max="100"
            ></progress>
          )}
        </div>
      )}
    </div>
  );
};

export default SelectColor;
