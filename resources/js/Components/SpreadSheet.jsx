import * as React from 'react';
import { SpreadsheetComponent } from '@syncfusion/ej2-react-spreadsheet';
import { useRef, useState } from 'react';

export default function App() {
    const spreadsheetRef = useRef(null);
    const [signature, setSignature] = useState(null);

    const addImageInSelectedRange = async () => {
        if (spreadsheetRef.current) {
            const spreadsheet = spreadsheetRef.current;
            const activeSheet = spreadsheet.getActiveSheet();
            const selectedRange = activeSheet.selectedRange;

            const [col, row] = parseCell(selectedRange); // Convert "A1" to [col, row]
            const nextRow = row + 2; // Below the image
            try {
                const file = await getFile('fad_chief.png'); // Get the file
                if (file) {
                    const reader = new FileReader();
                    reader.onload = () => {
                        spreadsheet.insertImage([
                            { src: reader.result, width: 100, height: 50, range: selectedRange }
                        ]);
                    };
                    reader.readAsDataURL(file);
                }

                const today = new Date().toLocaleDateString();
                spreadsheet.updateCell({ value: today }, `${col}${nextRow}`);
            } catch (error) {
                console.error("Error inserting image:", error);
            }
        }
    };

    const parseCell = (cell) => {
        const match = cell.match(/([A-Z]+)(\d+)/);
        if (match) {
            return [match[1], parseInt(match[2])];
        }
        return ["A", 1]; 
    };

    const getFile = async (filename) => {
        try {
            const fileUrl = `/storage/signatures/${filename}`;
            const response = await fetch(fileUrl);
            if (!response.ok) throw new Error("File not found");
            const blob = await response.blob();
            return new File([blob], filename, { type: blob.type });
        } catch (error) {
            console.error("Error fetching file:", error);
            return null;
        }
    };

    return (
        <>
            <button onClick={addImageInSelectedRange}>Add Image</button>
            <SpreadsheetComponent
                ref={spreadsheetRef}
                openUrl="https://localhost:7086/api/Spreadsheet/Open"
                saveUrl="https://localhost:7086/api/Spreadsheet/Save"
                allowOpen={true}
                allowSave={true}
                height={'100vh'}
            />
        </>
    );
}
