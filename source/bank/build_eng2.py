import json, random, collections
exec(open('eng_batch2_src.py').read())
L="ABCDE"
out=[]; counters=collections.defaultdict(int)
random.seed(7)
# balanced but shuffled key positions per subarea
need=collections.Counter(it['id'][:3] for it in items if it['format']=="Multiple choice")
posq={}
for sub,n in need.items():
    q=[i%4 for i in range(n)]; random.shuffle(q)
    # avoid runs of 3 identical keys
    for _ in range(1000):
        if all(not(q[i]==q[i+1]==q[i+2]) for i in range(len(q)-2)): break
        random.shuffle(q)
    posq[sub]=q
for it in items:
    obj=it['id'].split('-')[0]; sub=obj[:3]
    base=dict(id=it['id'],section="English",subarea=sub,objective=obj,format=it['format'],stem=it['stem'])
    if it['format']=="Multiple choice":
        pos=posq[sub][counters[sub]]; counters[sub]+=1
        wr=it['wrongs'][:]
        opts=[w[0] for w in wr]; notes=[w[1] for w in wr]
        opts.insert(pos,it['correct']); notes.insert(pos,None)
        dist="; ".join(f"{L[i]}: {n}" for i,n in enumerate(notes) if n)
        # sentence-style: separate with ". " like batch1 -> use space
        dist=" ".join(f"{L[i]}: {n[0].upper()+n[1:] if False else n}" for i,n in enumerate(notes) if n)
        base.update(options=opts,answer=L[pos],explanation=it['explanation'],distractors=dist)
    else:
        base.update(options=it['options'],answer=it['answer'],explanation=it['explanation'],distractors=it['distractors'])
    base.update(difficulty=it['difficulty'],diagnostic="Yes")
    out.append(base)
# rotate positions within subarea so not strictly cyclic by objective: shuffle assignment
json.dump(out,open('eng_batch2.json','w'),indent=1,ensure_ascii=False)
c=collections.Counter((o['subarea'],o['answer']) for o in out if o['format']=="Multiple choice")
print(sorted(c.items()))
print(collections.Counter(o['objective'] for o in out))
for o in out:
    if o['format']=="Multiple choice":
        k=L.index(o['answer']); lens=[len(x) for x in o['options']]
        if lens[k]==max(lens) and lens.count(max(lens))==1 and lens[k]-sorted(lens)[-2]>8: print("LONGEST",o['id'],lens)
