import json, random, collections
exec(open('read_batch2_src.py').read())
L="ABCDE"; out=[]; random.seed(23)
need=collections.Counter(it['id'][:3] for it in items if 'wrongs' in it)
posq={}
for sub,n in need.items():
    q=[i%4 for i in range(n)]
    for _ in range(5000):
        random.shuffle(q)
        if all(not(q[i]==q[i+1]==q[i+2]) for i in range(len(q)-2)): break
    posq[sub]=q
cnt=collections.defaultdict(int)
for it in items:
    obj=it['id'].split('-')[0]; sub=obj[:3]
    b=dict(id=it['id'],section="Reading",subarea=sub,objective=obj,passage=it['passage'],format=it['format'],stem=it['stem'])
    if 'wrongs' in it:
        pos=posq[sub][cnt[sub]]; cnt[sub]+=1
        opts=[w[0] for w in it['wrongs']]; notes=[w[1] for w in it['wrongs']]
        opts.insert(pos,it['correct']); notes.insert(pos,None)
        b.update(options=opts,answer=L[pos],explanation=it['explanation'],distractors=" ".join(f"{L[i]}: {n}" for i,n in enumerate(notes) if n))
    else:
        b.update(options=it['options'],answer=it['answer'],explanation=it['explanation'],distractors=it['distractors'])
    b.update(difficulty=it['difficulty'],diagnostic="Yes"); out.append(b)
json.dump(out,open('read_batch2.json','w'),indent=1,ensure_ascii=False)
print(len(out), collections.Counter(o['objective'] for o in out))
print(sorted(collections.Counter((o['subarea'],o['answer']) for o in out if o['format']=="Multiple choice").items()))
for o in out:
    if o['format']=="Multiple choice":
        k=L.index(o['answer']); lens=[len(x) for x in o['options']]
        s=sorted(lens)
        if lens[k]==s[-1] and s[-1]-s[-2]>12: print("LONGEST",o['id'],lens)
P={p['id']:p for p in json.load(open('reading_passages.json'))}
blind=[]
for o in out:
    ids=[x.strip() for x in o['passage'].replace(' and ',',').split(',')]
    blind.append(dict(id=o['id'],format=o['format'],passages=ids,stem=o['stem'],options=o['options']))
json.dump(dict(passages=list(P.values()),items=blind),open('../review/blind_read2.json','w'),indent=1,ensure_ascii=False)
