import React, { useState, useEffect } from 'react';

const TestDatabaseLoad: React.FC = () => {
  const [fileContent, setFileContent] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [parsedJson, setParsedJson] = useState<any>(null);

  useEffect(() => {
    const loadFile = async () => {
      try {
        console.log('Testing direct file load...');
        setLoading(true);
        
        // Try multiple paths
        const paths = [
          './teams-database.json',
          '/teams-database.json',
          'teams-database.json'
        ];
        
        let success = false;
        
        for (const path of paths) {
          try {
            console.log(`Trying to load from: ${path}`);
            const response = await fetch(path);
            
            if (!response.ok) {
              console.log(`Path ${path} failed with status: ${response.status}`);
              continue;
            }
            
            // Get the text content
            const text = await response.text();
            setFileContent(text);
            console.log(`File loaded successfully from ${path}, length:`, text.length);
            
            // Try to parse it as JSON to confirm it's valid
            try {
              const json = JSON.parse(text);
              console.log('JSON parsed successfully, teams:', json.teams?.length || 0);
              setParsedJson(json);
              success = true;
              break; // Exit the loop if successful
            } catch (jsonError) {
              console.error('JSON parsing error:', jsonError);
              setError(`The file was loaded from ${path} but is not valid JSON.`);
            }
          } catch (fetchError) {
            console.error(`Error fetching from ${path}:`, fetchError);
          }
        }
        
        if (!success) {
          setError('Failed to load teams database from any path. Please check the console for details.');
        }
      } catch (err) {
        console.error('File loading error:', err);
        setError(`Failed to load file: ${err instanceof Error ? err.message : String(err)}`);
      } finally {
        setLoading(false);
      }
    };

    loadFile();
  }, []);

  if (loading) {
    return <div>Testing database file access...</div>;
  }

  if (error) {
    return (
      <div className="error-container">
        <h3>Error Loading Database</h3>
        <p>{error}</p>
        <p>
          Make sure your teams-database.json file is placed in the public folder 
          of your React project.
        </p>
        <p>
          File path should be: /public/teams-database.json
        </p>
        <p>
          <strong>Troubleshooting:</strong> Try refreshing the page or reopening your browser.
          If using development mode, restart your development server with npm start.
        </p>
      </div>
    );
  }

  if (!fileContent) {
    return <div>No content found in database file.</div>;
  }

  return (
    <div className="test-container">
      <h3>Database File Successfully Loaded!</h3>
      <p>The file was found and loaded successfully.</p>
      <p>File size: {fileContent.length} characters</p>
      <p>Teams found: {parsedJson?.teams?.length || 0}</p>
      
      {parsedJson?.teams && parsedJson.teams.length > 0 && (
        <div>
          <h4>First Team in Database:</h4>
          <pre className="file-preview">
            {JSON.stringify(parsedJson.teams[0], null, 2)}
          </pre>
        </div>
      )}
      
      <p>If you're still having issues with the Team Browser, please check the browser console (F12 → Console) for more detailed error messages.</p>
      <h4>First 500 characters of file:</h4>
      <pre className="file-preview">
        {fileContent.substring(0, 500)}...
      </pre>
    </div>
  );
};

export default TestDatabaseLoad;
