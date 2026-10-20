"""Apply the existing transparent logo to the desert film's tracked steel faces.

Usage: python scripts/brand-desert-hero.py --ffmpeg <ffmpeg.exe> [--preview]
Original footage and original truck PNG are never overwritten.
"""
import argparse
import json
import subprocess
from pathlib import Path

import cv2
import numpy as np

ROOT = Path(__file__).resolve().parents[1]
MEDIA = ROOT / 'public/media/home-hero'
SOURCE = MEDIA / 'hero-1016-smooth.mp4'
OUT = ROOT.parent / 'tmp/hero-branding'
FPS = 30
# Plane corners measured in the 960 x 540 inspection frames. Wall order is
# rear-top, front-top, front-bottom, rear-bottom; roof order follows the long
# axis from front to rear, keeping the logo upright when the truck turns.
WALL = [
    (0, [[382,211],[497,155],[496,294],[381,294]]),
    (.75, [[378,208],[500,146],[499,296],[377,296]]),
    (1.5, [[365,204],[495,133],[493,295],[364,295]]),
    (2, [[335,200],[467,118],[464,296],[334,296]]),
    (2.5, [[305,198],[432,98],[430,299],[304,299]]),
    (3, [[291,195],[398,76],[394,301],[290,299]]),
    (3.5, [[302,201],[373,73],[371,315],[301,310]]),
    (4, [[354,205],[379,118],[376,350],[354,338]]),
    (4.3, [[381,173],[384,155],[384,342],[381,340]]),
]
ROOF = [
    (4.5, [[409,123],[420,121],[550,121],[562,123]]),
    (5, [[394,126],[421,80],[529,80],[591,126]]),
    (5.5, [[399,151],[427,44],[525,44],[566,151]]),
    (6, [[407,179],[430,31],[524,31],[550,179]]),
    (6.7, [[409,223],[429,22],[516,22],[530,223]]),
    (7, [[391,245],[398,-22],[501,-22],[509,245]]),
    (7.25, [[365,258],[370,-68],[475,-68],[480,258]]),
    (7.5, [[325,268],[326,-105],[432,-105],[434,268]]),
    (7.75, [[273,283],[273,-95],[376,-95],[376,283]]),
    (8, [[223,302],[223,-65],[324,-65],[324,302]]),
    (8.25, [[189,325],[189,-31],[289,-31],[289,325]]),
    (8.5, [[179,344],[179,-6],[277,-6],[277,344]]),
    (8.75, [[179,352],[179,8],[276,8],[276,352]]),
    (9, [[179,358],[179,16],[276,16],[276,358]]),
    (9.833333, [[179,366],[179,21],[275,21],[275,366]]),
]


def interpolate(keys, frame):
    t = frame / FPS
    for (a, qa), (b, qb) in zip(keys, keys[1:]):
        if t <= b:
            p = np.clip((t-a)/(b-a), 0, 1)
            return np.array(qa, np.float32)*(1-p)+np.array(qb, np.float32)*p
    return np.array(keys[-1][1], np.float32)


def track_planes(grays, keys):
    result = {}
    for (ta, qa), (tb, qb) in zip(keys, keys[1:]):
        a, b = round(ta*FPS), min(len(grays)-1, round(tb*FPS))
        quad = np.array(qa, np.float32)
        tracked = [quad.copy()]
        for frame in range(a+1, b+1):
            mask = np.zeros_like(grays[frame-1])
            cv2.fillConvexPoly(mask, np.round(quad).astype(np.int32), 255)
            points = cv2.goodFeaturesToTrack(grays[frame-1], 140, .008, 5, mask=mask)
            matrix = None
            if points is not None and len(points) >= 8:
                moved, status, _ = cv2.calcOpticalFlowPyrLK(
                    grays[frame-1], grays[frame], points, None,
                    winSize=(25,25), maxLevel=3,
                    criteria=(cv2.TERM_CRITERIA_EPS|cv2.TERM_CRITERIA_COUNT, 30, .01))
                valid = status[:,0] == 1
                if valid.sum() >= 8:
                    matrix, _ = cv2.findHomography(points[valid], moved[valid], cv2.RANSAC, 2)
            if matrix is not None:
                candidate = cv2.perspectiveTransform(quad[None], matrix)[0]
                if np.isfinite(candidate).all() and np.max(np.abs(candidate-quad)) < 45:
                    quad = candidate.astype(np.float32)
                else:
                    quad += interpolate(keys, frame)-interpolate(keys, frame-1)
            else:
                quad += interpolate(keys, frame)-interpolate(keys, frame-1)
            tracked.append(quad.copy())
        # Anchor every segment to measured corners, distributing small optical
        # flow drift over the interval instead of snapping the logo at a key.
        correction = np.array(qb,np.float32)-tracked[-1]
        print(f'Plane {ta:g}–{tb:g}s: anchor correction {np.max(np.abs(correction)):.1f}px', flush=True)
        for offset, value in enumerate(tracked):
            result[a+offset] = (interpolate(keys,a+offset) if np.max(np.abs(correction))>20
                               else value+correction*(offset/max(1,b-a)))
    return result


def paint(frame, logo, plane, strength=1):
    unit = np.float32([[0,0],[1,0],[1,1],[0,1]])
    transform = cv2.getPerspectiveTransform(unit, np.float32(plane))
    # Broad margins keep the ink clear of steel corner fittings and seals.
    inset = np.float32([[[.16,.10],[.84,.10],[.84,.90],[.16,.90]]])
    quad = cv2.perspectiveTransform(inset, transform)[0]
    if abs(cv2.contourArea(quad)) < 8:
        return
    h, w = frame.shape[:2]
    left, top = np.maximum(0, np.floor(quad.min(axis=0)).astype(int)-2)
    right, bottom = np.minimum([w,h], np.ceil(quad.max(axis=0)).astype(int)+3)
    if right <= left or bottom <= top:
        return
    lh,lw = logo.shape[:2]
    matrix = cv2.getPerspectiveTransform(
        np.float32([[0,0],[lw,0],[lw,lh],[0,lh]]), np.float32(quad-[left,top]))
    warped = cv2.warpPerspective(logo,matrix,(right-left,bottom-top),flags=cv2.INTER_CUBIC)
    steel = frame[top:bottom,left:right].astype(np.float32)
    # Let the steel's corrugation, warm lighting and shadows show through the
    # ink. Dark cab/mirror occlusions cannot receive a floating logo.
    light = steel.mean(axis=2)
    visibility = np.clip((light-80)/55,0,1)
    alpha = warped[:,:,3].astype(np.float32)/255*.96*strength*visibility
    ink = np.minimum(255,warped[:,:,:3].astype(np.float32)*steel/235)
    frame[top:bottom,left:right] = np.clip(
        steel*(1-alpha[:,:,None])+ink*alpha[:,:,None],0,255).astype(np.uint8)


def main():
    parser=argparse.ArgumentParser()
    parser.add_argument('--ffmpeg', required=True)
    parser.add_argument('--preview', action='store_true')
    args=parser.parse_args()
    OUT.mkdir(parents=True,exist_ok=True)
    cap=cv2.VideoCapture(str(SOURCE)); grays=[]
    while True:
        ok,frame=cap.read()
        if not ok: break
        grays.append(cv2.cvtColor(cv2.resize(frame,(960,540)),cv2.COLOR_BGR2GRAY))
    cap.release()
    wall=track_planes(grays,WALL); roof=track_planes(grays,ROOF)
    logo=cv2.imread(str(ROOT/'public/images/panvibes-logo-transparent.png'),cv2.IMREAD_UNCHANGED)
    previews={0,45,90,120,150,180,201,210,225,255,len(grays)-1}
    cap=cv2.VideoCapture(str(SOURCE))
    encoder=None
    if not args.preview:
        encoder=subprocess.Popen([args.ffmpeg,'-y','-hide_banner','-loglevel','error',
            '-f','rawvideo','-pix_fmt','bgr24','-s','1920x1080','-r','30','-i','pipe:0',
            '-an','-c:v','libx264','-preset','fast','-crf','21','-g','1','-keyint_min','1',
            '-bf','0','-pix_fmt','yuv420p','-movflags','+faststart',
            str(MEDIA/'hero-desert-branded-desktop.mp4')],stdin=subprocess.PIPE)
    last=None
    for index in range(len(grays)):
        ok,frame=cap.read()
        if not ok: break
        if index in wall:
            paint(frame,logo,wall[index]*2)
        if index in roof:
            paint(frame,logo,roof[index]*2)
        if index in previews:
            cv2.imwrite(str(OUT/f'branded-{index:03}.jpg'),cv2.resize(frame,(960,540)))
        if encoder:
            encoder.stdin.write(frame.tobytes())
        last=frame
        if index % 60 == 0: print(f'Branded frame {index}/{len(grays)}',flush=True)
    cap.release()
    if encoder:
        encoder.stdin.close()
        if encoder.wait(): raise RuntimeError('Desktop encoder failed')
        subprocess.run([args.ffmpeg,'-y','-hide_banner','-loglevel','error','-i',
            str(MEDIA/'hero-desert-branded-desktop.mp4'),'-an','-vf','scale=960:540:flags=lanczos',
            '-c:v','libx264','-preset','fast','-crf','22','-g','1','-keyint_min','1','-bf','0',
            '-pix_fmt','yuv420p','-movflags','+faststart',str(MEDIA/'hero-desert-branded-mobile.mp4')],check=True)
        subprocess.run([args.ffmpeg,'-y','-hide_banner','-loglevel','error','-i',
            str(MEDIA/'hero-desert-branded-desktop.mp4'),'-frames:v','1','-vf','scale=1280:720',
            '-q:v','3',str(MEDIA/'hero-desert-branded-poster.jpg')],check=True)
        # Retain the original PNG's exact silhouette/body. Apply the matching
        # roof mark in its source coordinates for the video-to-canvas handoff.
        sprite=cv2.imread(str(MEDIA/'handoff-truck.png'),cv2.IMREAD_UNCHANGED)
        quad=roof[len(grays)-1]*2
        quad=(quad-[342,36])*[356/234,1494/993]+[301,94]
        rgb=sprite[:,:,:3].copy();paint(rgb,logo,quad)
        sprite[:,:,:3]=rgb
        dest=ROOT/'public/images/branded/home-hero/desert-handoff-truck.png'
        cv2.imwrite(str(dest),sprite)
        mapping_path=ROOT/'lib/container-branding-assets.json'
        mapping=json.loads(mapping_path.read_text())
        mapping['/media/home-hero/handoff-truck.png']='/images/branded/home-hero/desert-handoff-truck.png'
        mapping_path.write_text(json.dumps(mapping,indent=2)+'\n')
        info={'source':'hero-1016-smooth.mp4','frames':len(grays),'fps':FPS,
              'wallKeys':WALL,'roofKeys':ROOF,'logo':'/images/panvibes-logo-transparent.png',
              'method':'Tracked planar perspective; transparent ink modulated by steel lighting; original footage preserved',
              'encoding':'All-intra H.264, no B frames, muted scroll scrubbing, fast-start'}
        (MEDIA/'hero-desert-branding.json').write_text(json.dumps(info,indent=2)+'\n')


if __name__=='__main__': main()
