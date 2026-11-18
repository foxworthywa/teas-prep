import json,sys
d=json.load(open(sys.argv[1]))['content']
body=d['tabs'][0]['documentTab']['body']
for el in body['content'][:15]:
    p=el.get('paragraph')
    if not p: continue
    t=''.join(e.get('textRun',{}).get('content','') for e in p['elements'])
    if t.startswith('Calculator'):
        print(json.dumps({"rev":d['revisionId'],"s":el['startIndex'],"e":el['endIndex'],"style":p['paragraphStyle'].get('namedStyleType'),"text":t[:40]}))
